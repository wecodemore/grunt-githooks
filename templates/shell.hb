if [ -f "{{gruntfilePath}}" ]
then
    (cd "{{gruntfileDirectory}}" && {{command}}{{#if task}} {{task}}{{/if}}{{#if hook}}::{{hook}}{{/if}}{{#if args}} {{args}}{{/if}} --gruntfile {{escapeBackslashes gruntfilePath}})
fi