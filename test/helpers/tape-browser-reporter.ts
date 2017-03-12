import tape from 'tape'
import WebSocket from 'ws'

const ws = new WebSocket('ws://localhost:9876')

ws.send('foobar')
