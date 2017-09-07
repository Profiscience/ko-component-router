pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        powershell 'npm run build'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
  }
}