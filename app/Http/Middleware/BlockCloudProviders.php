<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BlockCloudProviders
{
    protected array $blockedCidrs = [
        '2600:1f16::/32',   // AWS IPv6
        '3.0.0.0/8',        // AWS IPv4 example
        '35.0.0.0/8',       // GCP IPv4 example
        '2600:1900::/28',   // GCP IPv6 example
        '40.0.0.0/8',       // Azure IPv4 example
        '2603::/18',        // Azure IPv6 example
    ];

    // Known crawlers with their valid reverse-DNS domains
    protected array $allowedCrawlers = [
        'Googlebot'   => ['.googlebot.com', '.google.com'],
        'Bingbot'     => ['.search.msn.com'],
        'DuckDuckBot' => ['.duckduckgo.com'],
        'Slurp'       => ['.crawl.yahoo.net'],
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();
        $ua = $request->userAgent();

        // 1. Allow verified major crawlers
        if ($this->isVerifiedCrawler($ip, $ua)) {
            return $next($request);
        }

        // 2. Block known cloud provider ranges
        foreach ($this->blockedCidrs as $cidr) {
            if ($this->ipInCidr($ip, $cidr)) {
                if ($request->expectsJson()) {
                    return response()->json(['error' => 'Access denied'], 403);
                }
                abort(403);
            }
        }

        return $next($request);
    }

    private function ipInCidr(string $ip, string $cidr): bool
    {
        if (str_contains($ip, ':')) {
            // Simple IPv6 check: match prefix
            return str_starts_with($ip, explode('::', $cidr)[0]);
        }

        // IPv4
        [$subnet, $mask] = explode('/', $cidr);

        return (ip2long($ip) & ~((1 << (32 - $mask)) - 1)) === ip2long($subnet);
    }

    private function isVerifiedCrawler(string $ip, ?string $userAgent): bool
    {
        if (! $userAgent) {
            return false;
        }

        foreach ($this->allowedCrawlers as $crawlerName => $validDomains) {
            if (stripos($userAgent, $crawlerName) === false) {
                continue;
            }

            // Reverse DNS lookup
            $host = gethostbyaddr($ip);
            if (! $host) {
                return false;
            }

            // Check that the host ends with one of the allowed domains
            $domainMatch = false;
            foreach ($validDomains as $domain) {
                if (str_ends_with($host, $domain)) {
                    $domainMatch = true;
                    break;
                }
            }

            if (! $domainMatch) {
                return false;
            }

            // Forward DNS lookup to confirm host resolves back to IP
            $forwardIps = gethostbynamel($host);

            return $forwardIps && in_array($ip, $forwardIps);
        }

        return false;
    }
}
