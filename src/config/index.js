var assert = require('assert')

// Validate the config for schema
var myEnv = require('schema')('myEnvironment', { fallbacks: 'STRICT_FALLBACKS' })
const configSchema = myEnv.Schema.create(require('./configSchema'))

const appconfig = require('config')
var validation = configSchema.validate(appconfig)

assert.deepEqual(
    validation.instance,
    appconfig
)

if (validation.isError()) {
    console.log("Config Schema validation failed. Please check the config file")
    process.exit(-1)
}

const configStr = JSON.stringify(appconfig)
require('dotenv').config()

const expandenv = require('expandenv')
const config = JSON.parse(expandenv(configStr))

module.exports = config