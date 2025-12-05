#!/bin/bash
set -e

echo "=========================================="
echo "Instalando OpenTelemetry Collector na VM"
echo "=========================================="

# 1. Download do Collector
echo "📥 Baixando OpenTelemetry Collector..."
OTEL_VERSION="0.91.0"
wget -q https://github.com/open-telemetry/opentelemetry-collector-releases/releases/download/v${OTEL_VERSION}/otelcol-contrib_${OTEL_VERSION}_linux_amd64.tar.gz

# 2. Extrair e instalar
echo "📦 Extraindo e instalando..."
tar -xzf otelcol-contrib_${OTEL_VERSION}_linux_amd64.tar.gz
sudo mv otelcol-contrib /usr/local/bin/
sudo chmod +x /usr/local/bin/otelcol-contrib
rm otelcol-contrib_${OTEL_VERSION}_linux_amd64.tar.gz

# 3. Criar usuário para o Collector
echo "👤 Criando usuário otelcol..."
sudo useradd --system --no-create-home --shell /bin/false otelcol || true

# 4. Criar diretórios
echo "📁 Criando diretórios..."
sudo mkdir -p /etc/otelcol
sudo mkdir -p /var/log/otelcol
sudo chown -R otelcol:otelcol /var/log/otelcol

# 5. Copiar configuração
echo "⚙️  Copiando configuração..."
sudo cp otelcol-config.yml /etc/otelcol/config.yml
sudo chown otelcol:otelcol /etc/otelcol/config.yml

# 6. Instalar systemd service
echo "🔧 Instalando systemd service..."
sudo cp otelcol.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable otelcol.service

# 7. Iniciar Collector
echo "🚀 Iniciando OpenTelemetry Collector..."
sudo systemctl start otelcol.service

# 8. Verificar status
echo ""
echo "=========================================="
echo "✅ Instalação completa!"
echo "=========================================="
echo ""
echo "Status do Collector:"
sudo systemctl status otelcol.service --no-pager

echo ""
echo "📊 Health check:"
curl -s http://localhost:13133 && echo "OK" || echo "FALHOU"

echo ""
echo "📝 Para ver os logs:"
echo "   sudo journalctl -u otelcol.service -f"
echo ""
echo "🔄 Para reiniciar:"
echo "   sudo systemctl restart otelcol.service"
echo ""
echo "🎯 Suas APIs devem apontar para: localhost:4317"
