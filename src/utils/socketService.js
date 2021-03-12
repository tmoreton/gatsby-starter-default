import Pusher from 'pusher-js';

const SocketClient = new Pusher(process.env.PUSHER_API_KEY, {
  cluster: process.env.PUSHER_CLUSTER,
});

export default SocketClient
