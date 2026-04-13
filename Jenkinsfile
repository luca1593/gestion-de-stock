pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh '''
                    npm install --legacy-peer-deps
                    npm run build
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                docker compose -f docker-compose.yml down --remove-orphans || true
                docker compose -f docker-compose.yml up -d --build --force-recreate
                '''
            }
        }
    }
}