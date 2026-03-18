/**
 * Shared helper: resolve company name (IT) or institution name (Teacher) from job object.
 * Use wherever vendor/recruiter/employer display name is needed. Prioritizes fields
 * returned by /api/v1/jobs/jobs/ (company_name, institution_name).
 */
(function () {
    'use strict';

    function getCompanyOrInstitutionName(job) {
        if (!job || typeof job !== 'object') return '—';
        var d = job.employer_details || job.posted_by_details || job.user_details || job.employer_profile || {};
        var pb = job.posted_by && typeof job.posted_by === 'object' ? job.posted_by : null;
        var emp = job.employer && typeof job.employer === 'object' ? job.employer : null;
        var isIT = (job.job_category || '').toLowerCase() === 'it' ||
            String(d.user_type || d.account_type || job.posted_by_type || '').toLowerCase().indexOf('it') !== -1;
        var name = '';
        var co = job.company;
        var inst = job.institution;
        var companyStr = (typeof co === 'string' && co) ? co : (co && typeof co === 'object' && (co.name || co.company_name)) ? (co.name || co.company_name) : '';
        var institutionStr = (typeof inst === 'string' && inst) ? inst : (inst && typeof inst === 'object' && (inst.name || inst.institution_name)) ? (inst.name || inst.institution_name) : '';

        if (isIT) {
            name = job.company_name || companyStr || job.company || job.employer_name || job.employer_display_name || job.organization_name
                || (d.company_name || d.company || d.organization_name || d.organization)
                || (pb && (pb.company_name || pb.company || pb.organization_name))
                || (emp && (emp.company_name || emp.company || emp.name))
                || job.vendor_name || job.posted_by_name || (d.name || d.full_name) || (pb && pb.name) || '';
        } else {
            name = job.institution_name || institutionStr || job.institution || job.school_name || job.school || job.employer_name || job.employer_display_name || job.organization_name
                || (d.institution_name || d.school_name || d.institution || d.school || d.organization_name)
                || (pb && (pb.institution_name || pb.school_name || pb.institution || pb.school))
                || (emp && (emp.institution_name || emp.school_name || emp.name))
                || job.posted_by_name || (d.name || d.company) || (pb && pb.name) || '';
        }
        if (!name) {
            name = job.posted_by_name || job.recruiter_name || job.company_name || job.company || job.institution_name || job.institution || job.school_name || job.school || job.organization_name
                || (d.name || d.full_name || d.company_name || d.company)
                || (pb && (pb.name || pb.company_name || pb.company))
                || (emp && (emp.name || emp.company_name || emp.company))
                || (typeof job.posted_by === 'string' ? job.posted_by : '');
        }
        return name || '—';
    }

    window.getCompanyOrInstitutionName = getCompanyOrInstitutionName;
})();
