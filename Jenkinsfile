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
                sh 'docker-compose up -d --build'
            }
        }
    }
}