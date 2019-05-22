var context = require.context('tests', true, /Test\.js?$/);
context.keys().forEach(context);