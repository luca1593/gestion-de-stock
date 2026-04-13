pipeline {
    agent any
    
    environment {
        API_URL = 'http://12.24.5.100:8085'
        COMPOSE_FILE = 'docker-compose.yml'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Deploy with Docker Compose') {
            steps {
                echo '🚀 Deploying with docker-compose...'
                sh '''
                    # Arrêter les services existants
                    docker docker-compose down || true
                    
                    # Build et démarrage
                    docker docker-compose up -d --build
                    
                    # Vérifier le statut
                    docker docker-compose ps
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🔍 Health check...'
                sh '''
                    sleep 10
                    curl -f http://localhost || exit 1
                    echo "✅ Application is healthy"
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ Deployment successful!'
            sh 'docker docker-compose logs --tail=20'
        }
        failure {
            echo '❌ Deployment failed!'
            sh 'docker docker-compose logs || true'
        }
    }
}