pipeline {
  agent any
  stages {
    stage('Dependencies') {
      steps {
        powershell 'yarn install'
      }
    }
    stage('Test') {
      steps {
        parallel(
          "Test": {
            powershell 'yarn test'
            
          },
          "Build": {
            powershell 'yarn build'
            
          }
        )
      }
    }
  }
}