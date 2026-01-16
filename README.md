# 🐳 Docker Compose Collections

A collection of **ready-to-use Docker Compose configurations** designed to simplify the setup of popular services and development environments.

This repository acts as a toolbox for developers and sysadmins who frequently need to spin up services like databases, caching layers, reverse proxies, CI/CD tools, and more — all with minimal effort.

---

## 🚀 What You’ll Find Here

- Pre-configured Docker Compose files for **common services** (databases, proxies, dev tools, etc.)
- Ready-to-deploy stacks for **development** and **production** environments
- Examples with **persistent storage**, **networking**, and **environment variable setups**
- Easy customization for your own workflows

---

## ⚙️ How to Use

1. Clone the repository:
   ```bash
   git clone https://github.com/marcuwynu23/docker-compose-collections.git
   ```
2. Navigate to the service folder you want to use.
3. Run:
   ```bash
   docker compose up -d
   # with .environment variables
   docker compose up -d  --env-file .env
   ```
4. Stop when finished:
   ```bash
   docker compose down
   ```

---

## 🤝 Contributing

Contributions are welcome! 🎉  
If you have a useful Docker Compose setup, feel free to open a pull request with a short explanation of your stack.

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and share.
