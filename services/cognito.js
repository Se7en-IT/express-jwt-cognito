const { promisify } = require('util')
const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
global.fetch = require('node-fetch')
const poolData = {
  UserPoolId: process.env.USER_POOL_ID,
  ClientId: process.env.CLIENT_ID
}
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)

module.exports = {
  login (email, password) {
    return new Promise((resolve, reject) => {
      var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password
      })

      var userData = {
        Username: email,
        Pool: userPool
      }
      var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            idToken: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken()
          })
        },
        onFailure: function (err) {
          reject(err)
        }
      })
    })
  },
  async getSession ({ username, idToken, accessToken, refreshToken }) {
    const AccessToken = new AmazonCognitoIdentity.CognitoAccessToken({ AccessToken: accessToken })
    const IdToken = new AmazonCognitoIdentity.CognitoIdToken({ IdToken: idToken })
    const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: refreshToken })

    const sessionData = {
      IdToken: IdToken,
      AccessToken: AccessToken,
      RefreshToken: RefreshToken
    }
    const userSession = new AmazonCognitoIdentity.CognitoUserSession(sessionData)

    const userData = {
      Username: username,
      Pool: userPool
    }

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
    const getSessionAsync = promisify(cognitoUser.getSession).bind(cognitoUser)
    const getUserDataAsync = promisify(cognitoUser.getUserData).bind(cognitoUser)

    cognitoUser.setSignInUserSession(userSession)
    await getSessionAsync()
    return getUserDataAsync()
  }
}
