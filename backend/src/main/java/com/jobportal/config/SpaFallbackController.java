package com.jobportal.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * SPA Fallback Controller — Replit / Production
 *
 * React Router uses client-side routing (e.g. /seeker, /recruiter, /admin).
 * When a user refreshes the page on such a route, Spring Boot tries to find
 * a server mapping and returns 404. This controller catches all non-API,
 * non-static requests and returns index.html so React Router can handle it.
 */
@Controller
public class SpaFallbackController {

    @RequestMapping(value = {
            "/",
            "/login",
            "/seeker",
            "/recruiter",
            "/admin"
    })
    public String forwardToReact() {
        return "forward:/index.html";
    }
}
