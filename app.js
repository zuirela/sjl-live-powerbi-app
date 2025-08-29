/*
 * Main entry point for the SJL Live Power BI web application.
 *
 * This Express app implements Microsoft Entra ID (Azure AD) authentication
 * using the authorization code flow via the MSAL Node library. After the
 * user signs in, their Azure AD account information is stored in the
 * session. The app then serves role‑based pages that embed Power BI
 * reports. Report configuration is defined in config.js and can be
 * overridden via environment variables.
 */

const express = require('express');
const session = require('express-session');
const msal = require('@azure/msal-node');
const config = require('./config');

const app = express();

// Use EJS for templating
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static assets from the public directory
app.use(express.static(__dirname + '/public'));

// Configure sessions. In production you should use a secure session store.
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'super_secret_session_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true if using HTTPS
    },
  })
);

/*
 * Initialize MSAL confidential client application.
 * We use the authorization code flow to sign users in via redirect.
 */
const msalConfig = {
  auth: {
    clientId: config.aad.clientId,
    authority: config.aad.authority,
    clientSecret: config.aad.clientSecret,
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        if (!containsPii) {
          console.log(message);
        }
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Info,
    },
  },
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

/*
 * Middleware to ensure a user is authenticated before allowing access
 * to protected routes. If no user is found in the session, redirect
 * to the login route.
 */
function ensureAuthenticated(req, res, next) {
  if (!req.session.account) {
    return res.redirect('/login');
  }
  next();
}

/*
 * Login route. Generates an authorization URL and redirects the user
 * to the Microsoft login page. The scopes defined in config.aad.scopes
 * determine what permissions are requested.
 */
app.get('/login', async (req, res) => {
  const authCodeUrlParams = {
    scopes: config.aad.scopes,
    redirectUri: config.aad.redirectUri,
  };
  try {
    const authCodeUrl = await pca.getAuthCodeUrl(authCodeUrlParams);
    return res.redirect(authCodeUrl);
  } catch (err) {
    console.error('Error in getAuthCodeUrl:', err);
    return res.status(500).send('Error generating authentication URL');
  }
});

/*
 * Redirect route. This route is the redirect URI configured for your
 * Azure AD application. After authentication, Azure AD will send the
 * user back to this route with a code query parameter. We then exchange
 * the code for an access token and store the account in the session.
 */
app.get('/redirect', async (req, res) => {
  const tokenRequest = {
    code: req.query.code,
    scopes: config.aad.scopes,
    redirectUri: config.aad.redirectUri,
  };
  try {
    const response = await pca.acquireTokenByCode(tokenRequest);
    req.session.account = response.account;
    return res.redirect('/');
  } catch (err) {
    console.error('Error acquiring token:', err);
    return res.status(500).send('Error acquiring authentication token');
  }
});

/*
 * Logout route. Clears the session and redirects the user to the home
 * page. You can optionally redirect to a post‑logout URL.
 */
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

/*
 * Home route. If the user is signed in, display a welcome message
 * and links to the various group dashboards. Otherwise, show a
 * sign‑in button.
 */
app.get('/', (req, res) => {
  res.render('index', {
    account: req.session.account,
    reports: config.reports,
  });
});

/*
 * Group dashboard route. Requires authentication. The :group parameter
 * corresponds to a key in config.reports. If the key is invalid,
 * a 404 page is returned. Otherwise, the corresponding embed URL
 * and IDs are passed to the view for rendering. Note that this code
 * does not generate embed tokens; you will need to implement token
 * generation in a real application or generate them via Azure AD
 * service principal and Power BI REST API. See README.md for details.
 */
app.get('/group/:name', ensureAuthenticated, (req, res) => {
  const groupName = req.params.name;
  const reportConfig = config.reports[groupName];
  if (!reportConfig) {
    return res.status(404).render('404');
  }
  res.render('group', {
    account: req.session.account,
    report: reportConfig,
    groupName,
  });
});

/*
 * 404 page for unknown routes.
 */
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(config.port, () => {
  console.log(`SJL Live Power BI app listening on http://localhost:${config.port}`);
});