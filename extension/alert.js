// Read query parameter `message` and alert it
// This is used to show notification from background page

const url = new URL(location.href);
const message = url.searchParams.get('message');
if (message) {
    alert(message);
}
