# Use a lightweight web server image
FROM nginx:alpine

# Copy the HTML, CSS, and JS files to the web server's root directory
COPY bee.html /usr/share/nginx/html/index.html
COPY bee.css /usr/share/nginx/html/bee.css
COPY bee.js /usr/share/nginx/html/bee.js

# Expose port 80 for the web server
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
