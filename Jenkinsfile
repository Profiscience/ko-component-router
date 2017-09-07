pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        powershell 'yarn build'
      }
    }
    stage('Test') {
      steps {
        powershell 'yarn test'
      }
    }
  }
}