if [ -f "{{gruntfilePath}}" ]
then
    (cd "{{gruntfileDirectory}}" && {{command}}{{#if task}} {{task}}{{/if}}{{#if args}} {{args}}{{/if}})
fi