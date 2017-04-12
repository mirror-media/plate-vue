const cluster = require('cluster')
const numCPUs = require('os').cpus().length
// Ask the number of CPU-s for optimal forking (one fork per CPU) var numCPUs = require('os').cpus().length;
cluster.setupMaster({
  exec : './server.js' // Points to the index file you want to fork
});
// Fork workers.
for (let i = 0; i < numCPUs; i++) { 
  cluster.fork()
}
cluster.on('disconnect', function(worker) { 
  console.log('a process disconnect!') // This can probably use some work. cluster.fork();
  cluster.fork()
});