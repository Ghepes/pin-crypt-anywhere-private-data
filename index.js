// We import the two local modules: by Studio Wromo - MIT 2026
const PrivateDataAnywhere = require('./crypto-widget.js');
const CloudSyncWidget = require('./transport-data.js');
const PublicDataFetcher = require('./wigets-get-public-data.js');

// We export them together
module.exports = {
  PrivateDataAnywhere,
  CloudSyncWidget,
  PublicDataFetcher
};
