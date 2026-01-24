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
    let session = Buffer.from('9981', 'hex')
    let session_ping = null
    switch(headers){
        case 0x8006:
            return Buffer.from('3f02060835dface0', 'hex');    
        break;
        case 0x3f0003:
            return Buffer.from('3f00090700d2444d545f4d415242454c4c41004c00f06d000010000068d4190092f70177e8210d0000006300890f000000006300b0d41900a3f2017700006300000c7000b88f00fefbff0258656e646f0520736520686120636f6e65637461646f00646f000002000000003305003600000000330500360000000000000000383838383232382e69de','hex')    
        break;
        case 0x3f00:
            return Buffer.from('3f00030400fe58656e646f3232323234001c667618e203ff10641900269d56c6f973d6c0fddb1ac570ac7f3f0000000069c64ebd150155000000803f02000000', 'hex')
            break;
        case 0x0003: //<- party data
            return Buffer.from('3f00030400fe426f743030005063003477000310e87c02ff10649104e55e1d465c55b244ba37d045b20435bf00000000340535bf000155000000803f02000000', 'hex')
        break;
        case 0x7f01:
            return Buffer.from('3f00020410ff004db3e48dc56d5f06442e47eac4c3f5c8bfff00000058656e646f3232323234770000004c0000409c4664006400', 'hex')
        break;
        case 0x3f02:
            session_ping = msg.slice(3, -1)
            return msg
        break;
        case 0x7f00:
            if(msg.readUInt8(2) === 0x01){
                const buff7f_before = Buffer.from('7f000102c2000000000000000000000050000000010000000000000013000000e0000000180000000000000000000000000000000000000000000000000000009c6fa5ebf4820c4c8cde707189e2b5111242191fb8bb154e44017636310079328a6fd5e7c70000000000000002000000000000009e6f85eb00000000020400000200000000000000070000000000000000000000000000000000000000000000000000008a6fd5e70000000000020000c70000000000000007000000cc0000001400000000000000000000000000000000000000430068006100760061006c006f007400650000005b004500530050005d000300580065006e0064006f000000', 'hex')
                const buff7f_after = Buffer.from('c3a737e005000000000000000200000000000000c2a747e00000000002040000020000000000000007000000000000000000000000000000000000000000000000000000c3a737e00000000000020000050000000000000007000000cc0000001400000000000000000000000000000000000000430068006100760061006c006f007400650000005b004500530050005d000300580065006e0064006f000000', 'hex')
                
                const buff7f = Buffer.concat([buff7f_before, session, buff7f_after])
                
                return buff7f_before
            }else{ 
                console.log('0x07 no recognice')
                const buff = Buffer.from('3f00020401ff004d1ac95bc602bfa3425627e1c5c3f5c83fff0000004a756e696f7250630034000000004c0000409c4664006400', 'hex')
                return buff
            }
           
            break;
        case 0x8002:
            
            session_ping = msg.slice(8, 11)
            return Buffer.concat([Buffer.from('3f020000', 'hex'), session]);
            break;
        case 0x8801:
            session = msg.slice(8, 11)
            msg.writeUInt8(0x02, 1)
            return msg
        break;
        case 0x0002:
            //hello client msg
            const buffer00002 = Buffer.from('000378b370000000ec0100005000000001000000000000000200000058000000180000000000000000000000000000000000000000000000000000009c6fa5ebf4820c4c8cde707189e2b5111242191fb8bb154e44017636310079325b004500530050005d000300580065006e0064006f000000012058656e646f33007200000000000000003139322e3136382e312e3133340000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005b4553505d0358656e646f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004d505f444d5f474152414a4500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000444d5f474152414a450000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e00000001000008066400b8220000e703','hex')
            buffer00002.writeUInt8(msg.readUInt8(2) ,2)
            buffer00002.writeUInt8(msg.readUInt8(3) ,3)
            //session = msg.slice(4, msg.length )
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