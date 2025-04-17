resource "kubernetes_namespace" "monitoring" {
  metadata {
    name = "monitoring"
  }
}

resource "helm_release" "prometheus_operator" {
  name       = "prometheus"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  namespace  = kubernetes_namespace.monitoring.metadata[0].name
  version    = "45.0.0"

  set {
    name  = "prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues"
    value = "false"
  }

  set {
    name  = "prometheus.prometheusSpec.serviceMonitorSelector"
    value = "{}"
  }

  set {
    name  = "grafana.adminPassword"
    value = "admin"  # In production, use a secret manager
  }

  set {
    name  = "grafana.persistence.enabled"
    value = "true"
  }

  set {
    name  = "grafana.persistence.size"
    value = "10Gi"
  }

  values = [
    file("${path.module}/values/prometheus-values.yaml")
  ]
}

resource "helm_release" "loki" {
  name       = "loki"
  repository = "https://grafana.github.io/helm-charts"
  chart      = "loki-stack"
  namespace  = kubernetes_namespace.monitoring.metadata[0].name
  version    = "2.9.10"

  set {
    name  = "grafana.enabled"
    value = "false"  # We're using the Grafana from kube-prometheus-stack
  }

  set {
    name  = "loki.persistence.enabled"
    value = "true"
  }

  set {
    name  = "loki.persistence.size"
    value = "10Gi"
  }
}

resource "kubernetes_manifest" "jobberman_service_monitor" {
  manifest = {
    apiVersion = "monitoring.coreos.com/v1"
    kind       = "ServiceMonitor"
    metadata = {
      name      = "jobberman-api"
      namespace = "monitoring"
      labels = {
        app = "jobberman-api"
      }
    }
    spec = {
      selector = {
        matchLabels = {
          app = "jobberman-api"
        }
      }
      endpoints = [
        {
          port     = "http"
          path     = "/metrics"
          interval = "15s"
        }
      ]
      namespaceSelector = {
        matchNames = ["jobberman"]
      }
    }
  }

  depends_on = [
    helm_release.prometheus_operator
  ]
}
