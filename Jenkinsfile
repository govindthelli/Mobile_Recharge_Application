pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh '''
          docker ps -q | xargs -r docker stop
          docker ps -aq | xargs -r docker rm
          DOCKER_BUILDKIT=1 docker compose down --remove-orphans || true
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
