pipeline {
    agent any
    
    environment {
        API_URL = 'http://12.24.5.100:8085'
        COMPOSE_FILE = 'docker-compose.yml'
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checkout source code...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📥 Installing npm dependencies...'
                sh 'npm ci --legacy-peer-deps'
            }
        }
        
        stage('Build') {
            steps {
                echo '🔨 Building Angular application...'
                sh 'npm run build --if-present'
            }
        }
        
        stage('Deploy with Docker Compose') {
            steps {
                echo '🚀 Deploying with docker-compose...'
                sh '''
                    docker-compose down || true
                    docker-compose up -d
                '''
            }
        }
        
        stage('Archive') {
            steps {
                echo '📦 Archiving build...'
                archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: true, fingerprint: true
            }
        }
    }
    
    post {
        success {
            echo '✅ Build and deploy successful!'
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}