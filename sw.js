;
//asignar un nombre y versión al cache. Archivos que me interesan cachear
const CACHE_NAME = 'v1_cache_programador_fitness',
  urlsToCache = [
    './',
    'https://fonts.googleapis.com/css?family=Raleway:400,700',
    'https://fonts.gstatic.com/s/raleway/v12/1Ptrg8zYS_SKggPNwJYtWqZPAA.woff2',
    'https://use.fontawesome.com/releases/v5.0.7/css/all.css',
    'https://use.fontawesome.com/releases/v5.0.6/webfonts/fa-brands-400.woff2',
    './style.css',
    './script.js',
    './img/ProgramadorFitness.png',
    './img/favicon.png'
  ]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  //espera hasta que el objeto cache pueda abrir el cache_name
  e.waitUntil(
    caches.open(CACHE_NAME)
    //El objeto cache devuelve promesa
      .then(cache => {
        //agrega al cache del dispositivo todas las urls en variable urlstocache
        return cache.addAll(urlsToCache)
        //ejecuta metodo. self hace referencia al sevice worker y espera
          .then(() => self.skipWaiting())
      })
      //en caso de error
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión.
//Permite activar el service worker.. Cuando se pierde conexion a wifi entra en accion este evento y busca recursos para ocupar el sitio en offline
self.addEventListener('activate', e => {
  //sirve como copia para comparar si la informacion del cache original ha cambiado 
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys() //keys permite ver llaves y que llaves de los archivos de cache han sido modificados. Devuelve promesa
    //nombre de archivos que estan en el cache es lo que devuelve la promesa
      .then(cacheNames => {
      
        return Promise.all(
          cacheNames.map(cacheName => { //Evalua uno por uno
            //Eliminamos lo que ya no se necesita en cache
            //si lo que esta en el cache actual no detecta algo lo elimina. indexof cuando no existe devuelve -1
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName) //elimina de la cache
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

//cuando el navegador recupera una url. Cuando regresa la conexion recupera los archivos y detecta si hubo cambios en version de cache
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request) //busca coincidencia en el cache a cada una de las peticiones que haga. request es una promesa que devuelve una respuesta
      .then(res => {
        if (res) {
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})



/*

PARA PONER EN PRODUCCION PODRIA SER EN GITHUB PAGES YA QUE LAS PWA
FUNCIONAN CON HTTPS.
EN NEW REPOSITORY
DAMOS NOMBRE Y CREATE REPOSITORY
COPIAMOS EL git remote add origin https://github.com/codigo2018/pwa.git QUE NOS DA GITHUB PARA VINCULAR
EN CARPETA EN LOCAL

EN GIT:
 git init ---inicar git
 git add .  --agregar archivos
 git commit -m "Primer commit"
 git branch gh-pages  --necesitamos git pages por default es rama master 
 git checkout gh-pages ---nos cambiamos a esa rama git pages
 git remote add origin https://github.com/codigo2018/pwa.git  ---ruta que da la cuenta de github
 git push -u origin gh-pages  ----empuja, origin es mi maquina

 la ruta seria 
 codigo2018.github.io/pwa

*/ 