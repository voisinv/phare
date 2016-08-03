module.exports = {
  js: {
    src: './client/js/**/*.js',
    dest: './build/client'
  },
  less: {
    src: './client/**/*.less',
    dest: './build/client/'
  },
  to: {
    build: {
      directory: {
        client: './build/client',
        server: './build/server'
      }
    },
    client: {
      dev: {
        js: {
          main: './client/app.js',
          all: './client/**/*.js'
        },
        html: {
          main: './client/index.html',
          all: ['./client/index.html', './client/**/*.jade']
        },
        css: {
          all: './client/**/*.less'
        }
      },
      build: {
        js: {
          main: 'app.min.js'
        },
        html: {
          main: './build/client/index.html'
        },
        css: {
          main: './build/client'
        }
      }
    },
    server: {
      dev: {
        js: {
          main: './server/server.js',
          all: './server/**/*.js'
        }
      },
      build: {
        js: {

        },
        html: {

        },
        css: {

        }
      }
    }
  }
};
