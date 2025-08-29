# SJL Live Power BI web application

Tämä projekti on yksinkertainen Node.js/Express‑pohjainen sovellus, joka näyttää Suomen Jääkiekkoliiton (SJL) toiminnan keskeiset mittarit Power BI ‑raportteina. Sovellukseen on integroitu Microsoft Entra ID (Azure AD) ‑autentikointi ja se hyödyntää SJL:n graafista ohjeistoa värimaailman ja tyylin osalta.

## Ominaisuudet

* **Microsoft Entra ID autentikointi** – käyttäjät kirjautuvat sisään organisaatiotunnuksillaan. Autentikointi toteutetaan MSAL Node ‑kirjaston avulla. 
* **Rooliperustaiset näkymät** – sovellus näyttää eri toimihenkilöryhmille omat Power BI ‑raportit. Ryhmien määrittely löytyy `config.js`‑tiedostosta.
* **Responsiivinen käyttöliittymä** – värimaailma perustuu SJL:n pääväriin (sininen #002E6D), lisävärit ovat vaaleansininen (#00ACD7), tummansininen (#011D41), betoni (#CFCFCD) ja kulta ’95 (#8B6F4E).

## Käyttöönotto

### 1. Lataa lähdekoodi

Pura ZIP‑paketti ja siirry projektikansioon:

```bash
unzip sjl_web_app.zip
cd sjl_web_app
```

### 2. Asenna riippuvuudet

Asenna Node.js‑riippuvuudet projektin juuresta:

```bash
npm install
```

### 3. Konfiguroi ympäristömuuttujat

Luo `.env`‑tiedosto projektin juureen ja määritä seuraavat arvot (voit myös muokata `config.js` suoraan):

```ini
# Portti, jolla palvelin käynnistyy
PORT=3000

# Azure AD sovelluksen tiedot
AAD_CLIENT_ID=<YOUR_AAD_APP_CLIENT_ID>
AAD_TENANT_ID=<YOUR_TENANT_ID>
AAD_CLIENT_SECRET=<YOUR_CLIENT_SECRET>
AAD_AUTHORITY=https://login.microsoftonline.com/<YOUR_TENANT_ID>
AAD_REDIRECT_URI=http://localhost:3000/redirect

# Power BI ‑raporttien upotuslinkit ja tunnisteet
PBI_MANAGEMENT_EMBED_URL=https://app.powerbi.com/reportEmbed?reportId=<REPORT_ID>&groupId=<WORKSPACE_ID>&autoAuth=true&ctid=<YOUR_TENANT_ID>
PBI_MANAGEMENT_REPORT_ID=<REPORT_ID>
PBI_MANAGEMENT_WORKSPACE_ID=<WORKSPACE_ID>

PBI_OPERATIONS_EMBED_URL=... # vastaava määrittely muille raporteille
PBI_FINANCE_EMBED_URL=...

# Session salaisuuden voi pitää oletusarvossa tai määrittää erikseen
SESSION_SECRET=some_random_secret
```

> **Huom!** Sovelluksessa ei generoida Power BI embed‑tokeneita. Upotettava raportti tulee olla julkaistu sellaisessa työtilassa, että käyttäjällä on oikeudet sen katsomiseen, tai embed‑URL‑osoitteen tulee sisältää token parametri (kuten `?access_token=` tms.). Jos haluat käyttää täysin lisenssivapaata embeddausta (app owns data), tarvitset service principalin ja A‑kapasiteetin. Lisätietoja löytyy Microsoftin dokumentaatiosta.

### 4. Käynnistä sovellus

Käynnistä palvelin kehitysympäristössä:

```bash
npm start
```

Sovellus käynnistyy oletuksena osoitteeseen `http://localhost:3000`. Siirry selaimessa tähän osoitteeseen ja kirjaudu organisaatiotunnuksellasi sisään.

## GitHubiin vieminen

Voit luoda uuden GitHub‑repositoryn (esim. `sjl-live-powerbi-app`) ja lisätä tämän koodin sinne. Luo repo GitHubin käyttöliittymässä ja siirrä tiedostot seuraavasti:

```bash
git init
git add .
git commit -m "Initial commit of SJL Live Power BI app"
git branch -M main
git remote add origin git@github.com:<your-username>/sjl-live-powerbi-app.git
git push -u origin main
```

Muista korvata `<your-username>` omalla GitHub‑käyttäjänimelläsi sekä tarvittaessa repositoryn nimellä. Tarvitset myös henkilökohtaisen access‑tokenin (PAT) tai SSH‑avaimen push‑oikeuksien määrittämiseen.

## Lisenssi

Tämä projekti on lisensoitu MIT‑lisenssillä.