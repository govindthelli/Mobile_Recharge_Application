pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh '''
          docker compose down -v || true
          '''
      }
    }
    stage('deploy') {
      steps {
        sh '''
          docker compose up -d --build || true
          '''
      }
    }
  }
}
