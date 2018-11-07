module.exports = {
  DB: process.env.DB || 'mongodb://localhost/logs',
  JWT_SECRET: process.env.JWT_SECRET,
  PAPERTRAIL_HOSTNAME: process.env.PAPERTRAIL_HOSTNAME || 'logs',
  PAPERTRAIL_HOST: process.env.PAPERTRAIL_HOST || 'logs.papertrailapp.com',
  PAPERTRAIL_PORT: process.env.PAPERTRAIL_PORT || 12345
}
