pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS22'
    }

    environment {
        USER_SERVICE_DIR = "src/user-services"
        TASK_SERVICE_DIR = "src/task-services"
        NOTIF_SERVICE_DIR = "src/notification-services"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'jenkins-setup',
                    url: 'https://github.com/curator-me/microservice-server.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // sh 'apk add --no-cache nodejs npm'
                dir(USER_SERVICE_DIR) {
                    sh 'npm install'
                }
                dir(TASK_SERVICE_DIR) {
                    sh 'npm install'
                }
                dir(NOTIF_SERVICE_DIR) {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir(USER_SERVICE_DIR) {
                    sh 'npm test || true'
                }
                dir(TASK_SERVICE_DIR) {
                    sh 'npm test || true'
                }
            }
        }

        stage('Start Services') {
            steps {
                dir(USER_SERVICE_DIR) {
                    sh 'npm start &'
                }
                dir(TASK_SERVICE_DIR) {
                    sh 'npm start &'
                }
                dir(NOTIF_SERVICE_DIR) {
                    sh 'npm start &'
                }
            }
        }
    }
}
