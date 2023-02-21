//@include lib_Class.js

sol.define("sol.hr.mixins.Configuration", {
  mixin: true,

  $configRelation: {  
    hr: "/hr/Configuration/hr.config",
    hronboarding: "/hr/Configuration/hr.onboarding.config",
    hrsecurityroles: "/hr/Configuration/hr.securityroles.config",
    hrrequests: "/hr/Configuration/hr.requests.config"
  }
});