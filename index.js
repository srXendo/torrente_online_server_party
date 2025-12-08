const dgram = require('dgram');
const server = dgram.createSocket('udp4');
let ip_server = '192.168.1.134'
let port_server = 8888
const buffer_session = Buffer.from('9a35fcbf', 'hex')
const user_fix_name = Buffer.from('Xendo3', 'ascii')
const user_name = Buffer.from('Xendo', 'ascii')
const user_bot = Buffer.from('Bot01', 'ascii')
let party = null
function handler_message(msg, rinfo){
    const headers = msg.readUInt16BE(0)
    let session = null
    let session_ping = null
    switch(headers){
        case 0x3f02:
            session_ping = msg.slice(3, -1)
            return Buffer.from('800601000a090000a0c4'+session_ping.toString('hex'), 'hex')
        break;
        case 0x7f00:
            if(msg.readUInt8(2) === 0x01){
                const buff7f_before = Buffer.from('7f000102c2000000000000000000000050000000010000000000000002000000e000000018000000000000000000000000000000000000000000000000000000c0a767e0785ddc459de8535abf5534eb', 'hex')
                const buff7f_after = Buffer.from('c3a737e005000000000000000200000000000000c2a747e00000000002040000020000000000000007000000000000000000000000000000000000000000000000000000c3a737e00000000000020000050000000000000007000000cc0000001400000000000000000000000000000000000000430068006100760061006c006f007400650000005b004500530050005d000300580065006e0064006f000000', 'hex')
                const buff7f = Buffer.from('7f000102c2000000000000000000000050000000010000000000000002000000e000000018000000000000000000000000000000000000000000000000000000c0a767e0785ddc459de8535abf5534eb1242191fb8bb154e4401763631007932c3a737e005000000000000000200000000000000c2a747e00000000002040000020000000000000007000000000000000000000000000000000000000000000000000000c3a737e00000000000020000050000000000000007000000cc0000001400000000000000000000000000000000000000430068006100760061006c006f007400650000005b004500530050005d000300580065006e0064006f000000','hex')
                
                return buff7f
            }else{ 
                console.log('0x07 no recognice')
            }
           
            break;
        case 0x8002:
            
            session_ping = msg.slice(8, 11)
            return Buffer.concat([Buffer.from('3f020000'), session_ping]);
            break;
        case 0x8801:
            msg.writeUInt8(0x02, 1)
            return msg
        break;
        case 0x0002:
            //hello client msg
            const buffer00002 = Buffer.from('00039b2b70000000ec010000500000000100000000000000020000005800000018000000000000000000000000000000000000000000000000000000c0a767e0785ddc459de8535abf5534eb1242191fb8bb154e44017636310079325b004500530050005d000300580065006e0064006f000000011058656e646f33007200000000000000003139322e3136382e312e3133340000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005b4553505d0358656e646f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014d505f425f414e444552475541544552000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000435f414e44455247554154455200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000001000008066400b8220000e703','hex')
            buffer00002.writeUInt8(msg.readUInt8(2) ,2)
            buffer00002.writeUInt8(msg.readUInt8(3) ,3)
            session = msg.slice(4, msg.length )
            return buffer00002
            break;
        default: 
            console.log("err: msg not recognice: ",msg.toString('hex'))
            console.error(new Error('msg not recognice'))
            return false
        break;
    }
}
server.on('message', (msg, rinfo) => {
    console.log(`Mensaje recibido: ${rinfo.address}:${rinfo.port}\n${msg.toString('hex')}`);
    console.log('handler_message')
    const response = handler_message(msg, rinfo)
    if(response){

        console.log(rinfo.port, rinfo.address)
        server.send(response, rinfo.port, rinfo.address, (err) => {
        if (err) {
            console.error(`Error al enviar la respuesta: ${err.message}`);
        } else {
            console.log(`Respuesta enviada: ${rinfo.port}:${rinfo.address}`);
            
        }
        
        console.log(`------FIN DEL MENSAJE------`);
        });
    }
});
server.on('listening', () => {
  const address = server.address();
  console.log(`Servidor UDP escuchando en ${address.address}:${address.port}`);
  console.log(`------INICIO DE LA ESCUCHA------`);
});

server.on('error', (err) => {
  console.error(`Error en el servidor: ${err.message}`);
  server.close();
});


// Configuración del servidor

const HOST = '0.0.0.0';
server.bind(8888, HOST);