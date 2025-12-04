pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS22'
    }

    environment {
        USER_SERVICE_DIR = "user-services"
        TASK_SERVICE_DIR = "task-services"
        NOTIF_SERVICE_DIR = "notification-services"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'jenkin-setup',
                    url: 'https://github.com/curator-me/microservice-server.git'
            }
        }
        
        stage('Verify Node.js') {
            steps {
                sh '''
                    echo "Node.js version:"
                    node --version
                    echo "NPM version:"
                    npm --version
                    echo "Node.js installation path:"
                    which node
                    which npm
                '''
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
                dir(NOTIF_SERVICE_DIR) {
                    sh 'nohup npm start &'
                }
                dir(USER_SERVICE_DIR) {
                    sh 'nohup npm start &'
                }
                dir(TASK_SERVICE_DIR) {
                    sh 'nohup npm start &'
                }
            }
        }
    }
}
