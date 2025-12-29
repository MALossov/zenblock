#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
RESET='\033[0m'

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$APP_DIR/.zenblock.pid"

# Check if service is running
is_running() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            return 0
        else
            rm "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Install service
install_service() {
    echo -e "${CYAN}Installing ZenBlock service...${RESET}"
    echo

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        PLIST_FILE="$HOME/Library/LaunchAgents/com.zenblock.app.plist"
        
        cat > "$PLIST_FILE" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.zenblock.app</string>
    <key>ProgramArguments</key>
    <array>
        <string>$APP_DIR/zenblock-cli.sh</string>
        <string>start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <false/>
    <key>WorkingDirectory</key>
    <string>$APP_DIR</string>
</dict>
</plist>
EOF
        
        launchctl load "$PLIST_FILE"
        echo -e "${GREEN}Auto-start enabled successfully!${RESET}"
    else
        # Linux
        SERVICE_FILE="$HOME/.config/systemd/user/zenblock.service"
        mkdir -p "$(dirname "$SERVICE_FILE")"
        
        cat > "$SERVICE_FILE" << EOF
[Unit]
Description=ZenBlock Service
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
ExecStart=$APP_DIR/zenblock-cli.sh start
Restart=on-failure

[Install]
WantedBy=default.target
EOF
        
        systemctl --user daemon-reload
        systemctl --user enable zenblock.service
        echo -e "${GREEN}Auto-start enabled successfully!${RESET}"
    fi
}

# Uninstall service
uninstall_service() {
    echo -e "${CYAN}Uninstalling ZenBlock service...${RESET}"
    echo

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        PLIST_FILE="$HOME/Library/LaunchAgents/com.zenblock.app.plist"
        
        if [ -f "$PLIST_FILE" ]; then
            launchctl unload "$PLIST_FILE"
            rm "$PLIST_FILE"
            echo -e "${GREEN}Auto-start disabled successfully!${RESET}"
        else
            echo -e "${YELLOW}Auto-start was not enabled${RESET}"
        fi
    else
        # Linux
        SERVICE_FILE="$HOME/.config/systemd/user/zenblock.service"
        
        if [ -f "$SERVICE_FILE" ]; then
            systemctl --user disable zenblock.service
            rm "$SERVICE_FILE"
            systemctl --user daemon-reload
            echo -e "${GREEN}Auto-start disabled successfully!${RESET}"
        else
            echo -e "${YELLOW}Auto-start was not enabled${RESET}"
        fi
    fi
}

# Start service
start_service() {
    echo -e "${CYAN}Starting ZenBlock service...${RESET}"
    echo

    if is_running; then
        echo -e "${YELLOW}Service is already running!${RESET}"
        return
    fi

    cd "$APP_DIR"
    nohup npm run start > /dev/null 2>&1 &
    echo $! > "$PID_FILE"

    echo -e "${GREEN}Service started successfully!${RESET}"
    echo "Access at: http://localhost:3000"
}

# Stop service
stop_service() {
    echo -e "${CYAN}Stopping ZenBlock service...${RESET}"
    echo

    if ! is_running; then
        echo -e "${YELLOW}Service is not running!${RESET}"
        return
    fi

    PID=$(cat "$PID_FILE")
    kill "$PID"
    rm "$PID_FILE"

    echo -e "${GREEN}Service stopped successfully!${RESET}"
}

# Restart service
restart_service() {
    echo -e "${CYAN}Restarting ZenBlock service...${RESET}"
    stop_service
    sleep 2
    start_service
}

# Service status
service_status() {
    if is_running; then
        PID=$(cat "$PID_FILE")
        echo -e "${GREEN}Service Status: RUNNING${RESET}"
        echo "PID: $PID"
    else
        echo -e "${RED}Service Status: STOPPED${RESET}"
    fi
}

# Open console
open_console() {
    echo -e "${CYAN}Opening console in browser...${RESET}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:3000/zh"
    else
        xdg-open "http://localhost:3000/zh" 2>/dev/null
    fi
}

# Open dashboard
open_dashboard() {
    echo -e "${CYAN}Opening dashboard in browser...${RESET}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:3000/zh/dashboard"
    else
        xdg-open "http://localhost:3000/zh/dashboard" 2>/dev/null
    fi
}

# View logs
view_logs() {
    echo -e "${CYAN}Recent logs:${RESET}"
    echo -e "${YELLOW}Log viewing not yet implemented${RESET}"
}

# Help
show_help() {
    echo
    echo -e "${CYAN}ZenBlock Service Management CLI${RESET}"
    echo
    echo "Usage: ./zenblock-cli.sh [command]"
    echo
    echo "Commands:"
    echo "  install     Install service (enable auto-start)"
    echo "  uninstall   Uninstall service (disable auto-start)"
    echo "  start       Start ZenBlock service"
    echo "  stop        Stop ZenBlock service"
    echo "  restart     Restart ZenBlock service"
    echo "  status      Check service status"
    echo "  open        Open console in browser"
    echo "  dashboard   Open dashboard in browser"
    echo "  logs        View service logs"
    echo
}

# Main
case "$1" in
    install)
        install_service
        ;;
    uninstall)
        uninstall_service
        ;;
    start)
        start_service
        ;;
    stop)
        stop_service
        ;;
    restart)
        restart_service
        ;;
    status)
        service_status
        ;;
    open)
        open_console
        ;;
    dashboard)
        open_dashboard
        ;;
    logs)
        view_logs
        ;;
    *)
        show_help
        ;;
esac
