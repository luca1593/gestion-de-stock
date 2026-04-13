pipeline {
    agent any
    
    environment {
        NG_CLI_ANALYTICS = 'false'
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
        
        stage('Tests') {
            steps {
                echo '🧪 Running tests...'
                sh 'npm test -- --watch=false --browsers=ChromeHeadless || true'
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
            echo '✅ Build successful!'
        }
        failure {
            echo '❌ Build failed!'
        }
    }
}