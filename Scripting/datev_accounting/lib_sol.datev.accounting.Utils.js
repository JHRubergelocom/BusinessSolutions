//@include lib_Class.js
//@include lib_sol.common.ObjectUtils.js
//@include lib_sol.common.RepoUtils.js
//@include lib_sol.common.IxUtils.js


sol.define("sol.datev.accounting.Utils", {
    singleton: true,



    /**
     * 
     * @param {*} sord 
     * @param {*} options 
     */
    getWorkflowConfig: function (sord, options) {
        var me = this, i, workflowSchemaId, workflowSchemas = [], lookupLocations = [],
            workflowRoles;

        options = options || {};
        options.resolverTemplates = options.resolverTemplates || [];
        options.basePath = options.basePath || "";

        if (!sord){
            throw "sord must not be null"
        }

        if (!sol.common.ObjectUtils.isArray(options.resolverTemplates) && options.resolverTemplates.length == 0){
            throw "Resolver templates have to be specified as an array and at least one resolver"
        }

        for (i = 0 ; i < options.resolverTemplates.length; ++i){
            var resolver = options.resolverTemplates[i], processFilePath;

            workflowSchemaId = me.resolveTemplate(sord, resolver)
            processFilePath = options.basePath + workflowSchemaId;

            if (sol.common.RepoUtils.exists(processFilePath)){
                workflowSchemas.push(processFilePath);
            } else {
                // for better error handling
                lookupLocations.push(processFilePath);
            }
        }

        if (workflowSchemas.length > 0){
            var processFilePath = workflowSchemas[0]; // use first match
            me.logger.info(["use workflow schema file {1}, all matches={2}", workflowSchemas.length, processFilePath , JSON.stringify(workflowSchemas)]);
            return {
                configFile: processFilePath,
                config: sol.create("sol.common.Config", { load: processFilePath, merge: true }).config
            };
        } else {
            throw {
                message: "For the object objId=" + sord.id + " was no workflow process file found. Either sord information or process configuration file is missing",
                lookupLocations: lookupLocations,
                toString: function() {
                    return this.message + ",\nlookup locations in " + this.lookupLocations.join()
                }
            }
            
        }
    },

    /**
     * Write an auto feed comment
     * @param {string|number} objId of the sord where the feed comment should be written, if objId is undefined, no feed comment will be written
     * @param {Object} feedConfig
     *  
     */
    handleMissingDocumentConfig: function(objId, feedConfig){
        var me = this, mergedFeedConfig;

        if (!objId){
            me.logger.warn("Could not write feed comment because objId is null");
            return;
        }

        /** note please use config workflowSets.feed.missingConfig parameters to override this behaviour. 
        *  All {@link feedConfig} will be overwrite default behaviour 
        */  

        mergedFeedConfig = feedConfig || {};
        mergedFeedConfig = {
            objId: objId,
            file: feedConfig.file || 'sol.datev.accounting.workflow',
            key: feedConfig.key || 'WORKFLOW.DATEV.ACCOUNTING.RECEIPTDOCUMENTS.CONFIGMISSING',
            data: feedConfig.data || ["INVOICE_TYPE"]
        }

        sol.common.IxUtils.execute("RF_sol_function_FeedComment", mergedFeedConfig);
    },

    /**
     * @private
     * @param resolverTemplate
     * @return {String}
     */
    resolveTemplate: function (sord, resolverTemplate) {
        var me = this;

        return sol.create('sol.common.Template', {
            source: resolverTemplate.source
        }).applySord(sord);
    }


});
