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
9.how to 

19.start session with mongoose for multiple write to ensure proper work of api by all write completions and avoding
one write fails and other all completed which created issues
20.make files for helper function which used across the app in folder 'utils' and make index.js file which export this all
helper function so all helper function can exported simply from one path and avoid single big file of helper function 
<<<<<<< Updated upstream
21.aggregate pipline how to group and convert object into flat array with query

=======
21.validate permission array coming from request in joi which allow only value stored in pre defined Object
22.restrict duplicate value in array in joi
23.Joi let pass validation for text type data from request have to enforce json format for request body
>>>>>>> Stashed changes
