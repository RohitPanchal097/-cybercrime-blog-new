import Parse from 'parse/dist/parse.min.js';

// TODO: Replace these with your Back4App Application ID and JavaScript Key
const APPLICATION_ID = 'BcrFId2bYxTz0PaIcTHoqERKz6TK2gbjee6srHSs';
const JAVASCRIPT_KEY = 'SD0IZOfh1JYPRBMGikCRMShrk7Np8zZJscIOAmAG';
const SERVER_URL = 'https://parseapi.back4app.com/';

Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
Parse.serverURL = SERVER_URL;

export default Parse;   