# 🚀 Node.js + MongoDB | Kubernetes | Helm | CI/CD (GitHub Actions + ArgoCD)

This project demonstrates a **Node.js application with MongoDB** deployed on a **microk8s Kubernetes cluster**, packaged with **Helm charts**, and automated using **CI/CD pipelines** with **GitHub Actions (CI)** and **ArgoCD (CD)**.

---

## 📌 Features
- **Node.js Backend** – RESTful API built with Express.js.  
- **MongoDB Database** – Persistent storage with PVC.  
- **Kubernetes (microk8s)** – Deployment on lightweight Kubernetes cluster.  
- **Helm Charts** – Kubernetes manifest packaging & configuration.  
- **GitHub Actions (CI)** – Automated build & push of Docker images.  
- **ArgoCD (CD)** – GitOps-driven deployment & synchronization.  

---

## 🏗️ Architecture
```plaintext
Developer → GitHub (Push Code)
          → GitHub Actions (CI) → Build & Push Docker Image
          → ArgoCD (CD) → Sync with Kubernetes Cluster
          → Helm Chart → Node.js App ↔ MongoDB (with PVC)
```
---

## ⚙️ Prerequisites
- **Node.js
- **MongoDB
- **Docker
- **microk8s or Kubernetes cluster
- **Helm
- **ArgoCD

---
