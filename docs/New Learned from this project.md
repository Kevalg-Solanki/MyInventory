1.Applying condition in Joi
	
	credential: Joi.alternatives()
			.conditional("type", [
				{
					is: "email",
					then: Joi.string()
						.email({ tlds: { allow: false } })
						.required(),
				},
				{
					is: "mobile",
					then: Joi.string()
						.pattern(/^\d{10}$/)
						.required()
						.messages({
							"string.pattern.base": "Mobile must be 10 digits",
						}),
				},
			])
			.required(),
			
2.Applying required or optional according to type var
type: Joi.string().valid("email","mobile").required(),
	email: Joi.string().email().when('type',{is: 'email',then:Joi.required,otherwise:Joi.optional()}),
	mobile:Joi.string().pattern(/^[0-9]{10}$/).when("type",{is:'mobile',then:Joi.required(),otherwise:Joi.optional})

3.Write user friendly user error message rather than exposing internal details by seding error in response

4.send sms with twilio
5.first create branch then start working on that task/bug
6.how to switch and create new branch
7.how to save changes temporary using "git stash"
8.how to switch branch using "git switch <branch-name>
9.write clear code that any team member can understand
10.Don't reapet code if code reapete wrap it in the function 
11.Always write bussines logic,data base query in the services not in controller
12.controller should only call service functin and handle http response
13.All response should have consistant structure
14.how to merge branches
15.how to delete branches after pushing from local and remote
16.Keep README updated
17.One function should only to one thing
18.Modulrization

19.start session with mongoose for multiple write to ensure proper work of api by all write completions and avoding
one write fails and other all completed which created issues
20.make files for helper function which used across the app in folder 'utils' and make index.js file which export this all
helper function so all helper function can exported simply from one path and avoid single big file of helper function 

