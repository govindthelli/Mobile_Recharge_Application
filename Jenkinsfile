pipeline {
    agent { label 'app-agent' }

    stages {
        
        stage('Clean & Stop Old Containers') {
            steps {
                sshagent(['app-ec2-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@<APP_EC2_IP> "
                            echo 'Stopping containers...';
                            docker ps -q | xargs -r docker stop;
                            docker ps -aq | xargs -r docker rm;
                            docker compose down --remove-orphans || true;
                            docker network prune -f || true;
                            docker volume prune -f || true;
                        "
                    '''
                }
            }
        }

        stage('Deploy New Containers') {
            steps {
                sshagent(['app-ec2-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@<APP_EC2_IP> "
                            echo 'Deploying...';
                            DOCKER_BUILDKIT=1 docker compose up --build -d;
                        "
                    '''
                }
            }
        }
    }
}
