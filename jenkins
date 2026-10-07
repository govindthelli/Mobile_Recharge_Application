pipeline {
    agent { label 'app-agent' }

    stages {

        stage('Copy Code to EC2') {
            steps {
                sshagent(['app-ec2-key']) {
                    sh '''
                        echo "Copying workspace to EC2..."
                        scp -o StrictHostKeyChecking=no -r $WORKSPACE/* ubuntu@98.86.175.197:/home/ubuntu/$JOB_NAME/
                    '''
                }
            }
        }

        stage('Clean Old Containers') {
            steps {
                sshagent(['app-ec2-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@98.86.175.197 "
                            cd /home/ubuntu/$JOB_NAME;
                            echo 'Stopping containers...';
                            docker ps -q | xargs -r docker stop;
                            docker ps -aq | xargs -r docker rm;
                            docker compose down --remove-orphans || true;
                        "
                    '''
                }
            }
        }

        stage('Deploy New Containers') {
            steps {
                sshagent(['app-ec2-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@98.86.175.197 "
                            cd /home/ubuntu/$JOB_NAME;
                            echo 'Deploying...';
                            DOCKER_BUILDKIT=1 docker compose up --build -d;
                        "
                    '''
                }
            }
        }
    }
}
