pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh '''
          docker compose down --remove-orphans || true
          '''
      }
    }
    stage('deploy') {
      steps {
        sh '''
          DOCKER_BUILDKIT=1 docker compose up --build -d
          '''
      }
    }
  }
}
