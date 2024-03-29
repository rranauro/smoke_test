const repl = require('repl');
const _ = require('underscore')._;

let request = (function(CLIENT_ID, CLIENT_SECRET) {
	const protocol = 'http://';
	const urlRoot = 'dev.scientist.com:3000';
	const _request = require('request');
	let urlPrefix;
	let _options = {headers: {}};
	let AccessToken;
	
	if (CLIENT_ID && CLIENT_SECRET) {
		urlPrefix = protocol + CLIENT_ID + ':' + CLIENT_SECRET + '@' + urlRoot;
	} else {
		urlPrefix = protocol + urlRoot;
	}
	
	return {
		OPTIONS: function( options ) {
			if (options && options.access_token) {
				_options.headers = {Authorization: 'Bearer ' + options.access_token};
				urlPrefix = protocol + urlRoot;
			}
			return this;
		},
		GET: function(url, callback) {

			_request({
				url: [urlPrefix, url].join('/'),
				headers: _options.headers
			}, function (error, response, body) {
		
				callback(error, {
					message: error,
					statusCode: response && response.statusCode,
					body: typeof body === 'string' ? JSON.parse( body ) : body
				});
			});			
		}
	}
}(process.env.CLIENT_ID, process.env.CLIENT_SECRET));

// method for "categories.json" and "providers.json" endpoints.
// since each endpoint can have its own business logic, probably need custom handler per endpoint.
const handler = function(request) {
	let commands = [{
		name: 'Categories',
		slug: 'categories',
		url : _.template('hello/world'),
//		url : _.template('api/categories.json'),
		ref: 'category_refs'
	},{
		name: 'Providers',
		slug: 'providers',
		url: _.template('api/providers.json?q=<%= provider %>&per_page=<%= per_page %>&page=<%= page %>'),
		provider: 'nill',
		page: 1,
		per_page: 10,
		ref: 'provider_refs',
		paging: true
	}];
	let context = [];
	let printCommands = function(ctx) {
		return (ctx || []).map(function(row) {
			return row.name;
		});
	};
	let findCommands = function(ctx, path) {

		if (!!path.length) {
			return findCommands( _.find((ctx && ctx.ref) ? ctx[ctx.ref] : (ctx.children || ctx), function(child) {
				return child.name.toLowerCase() === path[0].toLowerCase();
			} ), path.slice(1) );
		}
		return ctx;
	};
	
	console.log(printCommands( commands ) );
	return function(cmd, local, fname, callback) {
		cmd = (cmd || '').toLowerCase().trim();
		let command;
		let url; 
		
		if (cmd === 'up' && context.length) {
			context.pop();
		} else if (cmd !== 'up' && cmd !== 'more' && cmd !== 'help'){
			context.push( cmd );
		} else if (cmd === 'help') {
			
			if (!context.length) {
				return callback(null, {message: 'Type "Category" or "Providers"'})
			}
		}
		
		command = findCommands( commands, context );
		if (command && command.name === 'Providers') {
			
			// make sure we have integers
			command.total = parseInt(command.total || -1, 10);
			command.per_page = parseInt(command.per_page || -1, 10);
			command.total_pages = command.total / command.per_page;
			
			// if this is "more", then increment the page
			command.page = ((cmd === 'more') ? parseInt(command.page, 10) + 1 : 1);
			
			// make sure requested page is not beyond total
			command.page = command.page < (command.per_page * command.page) 
			? command.total / command.per_page 
			: command.page;	
		} 
		
		
		// command.url() is function that take an object for substituting values.
		url = command && _.isFunction(command.url) && command.url({
			provider: command.provider,
			page: command.page,
			per_page: command.per_page
		});
		
		if (url) {
			request.GET(url, function(err, response) {
				
				if (~process.argv.indexOf('--show')) {
					console.log(require('util').inspect(response, null, 4))
				}

				if (response && response.statusCode !== 200) {
					throw new Error(response.body.message);
				}
				_.extend(command, response.body);
				
				if (cmd === 'providers') {
					cmdPrompt = ['Browsing (more):', context.join(' > ')].join('');
				} else {
					cmdPrompt = ['Browsing:', context.join(' > ')].join('');
				}
				console.log( cmdPrompt );
				callback(null, printCommands( command[command.ref] ) );
			});	
		} else if (command && command.children) {
			console.log( cmdPrompt );
			if (cmd === 'providers') {
				cmdPrompt = ['Browsing (more):', context.join(' > ')].join('');
			} else {
				cmdPrompt = ['Browsing:', context.join(' > ')].join('');
			}
			callback(null, printCommands( command.children ));
		} else if (command) {
			callback(null, command);
		} else {
			context.pop();
			callback(null, {warning: 'Command not recognized.'});
		}
	}
};

// authenticate and fetch the access_token
request.GET('oauth/token?grant_type=client_credentials', function(err, response) {	
	request.OPTIONS( response.body )
	repl.start({ prompt: 'Scientist.com API> ', eval: handler(request) });
});