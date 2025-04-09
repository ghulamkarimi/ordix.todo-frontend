# Basis-Image
FROM node:22.14.0

# Arbeitsverzeichnis
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package*.json ./
RUN npm install

# Rest der App kopieren
COPY . .

# Port für Vite
EXPOSE 5173

# Startbefehl
CMD ["npm", "run", "dev", "--", "--host"]
