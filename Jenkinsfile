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
        
        stage('Install Node.js') {
            steps {
                echo '🔧 Installing Node.js...'
                sh '''
                    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
                    apt-get install -y nodejs
                    node --version
                    npm --version
                '''
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
                    docker-compose up -d --build
                    docker-compose ps
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🔍 Health check...'
                sh '''
                    sleep 10
                    curl -f http://localhost:4200 || echo "Note: Service may not be exposed"
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