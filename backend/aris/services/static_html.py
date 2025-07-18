"""Static HTML generation service for academic search engines.

This module generates static HTML pages with complete academic metadata
for search engine indexing, while redirecting human users to the SPA.
"""

import json
from typing import Optional

from ..models import File
from .citation import CitationService
from .metadata import generate_academic_metadata


def generate_static_html(file: File) -> str:
    """Generate static HTML page with academic metadata and user redirect.
    
    This function is kept for backwards compatibility but delegates to the service version.
    
    Parameters
    ----------
    file : File
        The published preprint file.
        
    Returns
    -------
    str
        Complete HTML page with academic metadata and redirect logic.
    """
    return generate_static_html_with_services(file)


def generate_static_html_with_services(file: File, citation_service: Optional[CitationService] = None) -> str:
    """Generate static HTML page with academic metadata and user redirect.
    
    This creates a static HTML page that:
    1. Contains complete academic metadata for search engines
    2. Redirects human users to the SPA version
    3. Provides fallback content for non-JS browsers
    
    Parameters
    ----------
    file : File
        The published preprint file.
    citation_service : CitationService, optional
        Citation service instance. If None, creates a new one.
        
    Returns
    -------
    str
        Complete HTML page with academic metadata and redirect logic.
    """
    # Generate academic metadata
    academic_metadata = generate_academic_metadata(file)
    dublin_core = academic_metadata["dublin_core"]
    schema_org = academic_metadata["schema_org"]
    citation_meta = academic_metadata["citation_meta"]
    open_graph = academic_metadata["open_graph"]
    
    # Base configuration
    base_url = "https://aris.com"  # TODO: Make configurable
    canonical_url = f"{base_url}/ication/{file.public_uuid}"
    
    # Format publication date
    pub_date = file.published_at.strftime("%B %d, %Y") if file.published_at else "Unknown"
    
    # Generate APA citation for display using citation service
    if citation_service is None:
        citation_service = CitationService(base_url=base_url)
    
    citation_info = citation_service.generate_citation_info(file)
    apa_citation = citation_info["formats"]["apa"]
    
    # Create HTML template
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{file.title or 'Untitled'} - {dublin_core['creator']} - Aris Preprint</title>
  
  <!-- Dublin Core Meta Tags -->
  <meta name="DC.title" content="{dublin_core['title']}">
  <meta name="DC.creator" content="{dublin_core['creator']}">
  <meta name="DC.subject" content="{dublin_core['subject']}">
  <meta name="DC.description" content="{dublin_core['description']}">
  <meta name="DC.publisher" content="{dublin_core['publisher']}">
  <meta name="DC.date" content="{dublin_core['date']}">
  <meta name="DC.type" content="{dublin_core['type']}">
  <meta name="DC.format" content="{dublin_core['format']}">
  <meta name="DC.identifier" content="{dublin_core['identifier']}">
  <meta name="DC.source" content="{dublin_core['source']}">
  <meta name="DC.language" content="{dublin_core['language']}">
  <meta name="DC.rights" content="{dublin_core['rights']}">

  <!-- Academic Citation Meta Tags (Highwire Press format) -->
  <meta name="citation_title" content="{citation_meta['citation_title']}">
  <meta name="citation_publication_date" content="{citation_meta['citation_publication_date']}">
  <meta name="citation_journal_title" content="{citation_meta['citation_journal_title']}">
  <meta name="citation_abstract_html_url" content="{citation_meta['citation_abstract_html_url']}">

  <!-- Open Graph Tags for Social Sharing -->
  <meta property="og:title" content="{open_graph['og:title']}">
  <meta property="og:type" content="{open_graph['og:type']}">
  <meta property="og:url" content="{open_graph['og:url']}">
  <meta property="og:site_name" content="{open_graph['og:site_name']}">
  <meta property="article:published_time" content="{open_graph['article:published_time']}">"""

    # Add description if available
    if "og:description" in open_graph:
        html_content += f"""
  <meta property="og:description" content="{open_graph['og:description']}">"""

    # Add canonical URL
    html_content += f"""
  <link rel="canonical" href="{canonical_url}">

  <!-- Schema.org Structured Data -->
  <script type="application/ld+json">
{json.dumps(schema_org, indent=2)}
  </script>

  <!-- User Redirect Logic -->
  <script>
    // Redirect human users to SPA, but let crawlers stay
    if (!/bot|crawler|spider|indexer|googlebot|bingbot|slurp|duckduckbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram/i.test(navigator.userAgent)) {{
      // Add small delay to ensure meta tags are processed
      setTimeout(() => {{
        window.location.replace('{canonical_url}');
      }}, 100);
    }}
  </script>
  
  <!-- Fallback meta refresh for non-JS browsers -->
  <meta http-equiv="refresh" content="3;url={canonical_url}">
  
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }}
    
    .header {{
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }}
    
    .title {{
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #2c3e50;
    }}
    
    .authors {{
      font-size: 18px;
      color: #7f8c8d;
      margin-bottom: 5px;
    }}
    
    .pub-date {{
      font-size: 14px;
      color: #95a5a6;
    }}
    
    .abstract-section {{
      background: #f8f9fa;
      padding: 25px;
      margin: 30px 0;
      border-radius: 8px;
      border-left: 4px solid #3498db;
    }}
    
    .abstract-title {{
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #2c3e50;
    }}
    
    .abstract-text {{
      font-size: 16px;
      line-height: 1.7;
    }}
    
    .keywords {{
      margin: 20px 0;
    }}
    
    .keywords-title {{
      font-weight: bold;
      margin-bottom: 8px;
    }}
    
    .keywords-list {{
      color: #7f8c8d;
      font-style: italic;
    }}
    
    .redirect-notice {{
      background: #e8f4f8;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #bee5eb;
      margin: 30px 0;
    }}
    
    .redirect-notice strong {{
      color: #0c5460;
    }}
    
    .redirect-link {{
      color: #007bff;
      text-decoration: none;
    }}
    
    .redirect-link:hover {{
      text-decoration: underline;
    }}
    
    .citation-section {{
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #e0e0e0;
      font-size: 14px;
      color: #666;
    }}
    
    .citation-title {{
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #2c3e50;
    }}
    
    .citation-box {{
      background: white;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-family: monospace;
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 15px;
    }}
    
    .citation-links {{
      display: flex;
      gap: 15px;
      margin-top: 10px;
    }}
    
    .citation-link {{
      color: #007bff;
      text-decoration: none;
      font-size: 14px;
    }}
    
    .citation-link:hover {{
      text-decoration: underline;
    }}
    
    .footer {{
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #95a5a6;
      text-align: center;
    }}
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title">{file.title or 'Untitled'}</h1>
    <div class="authors"><strong>Authors:</strong> {dublin_core['creator']}</div>
    <div class="pub-date"><strong>Published:</strong> {pub_date}</div>
  </div>
  
  <div class="abstract-section">
    <h3 class="abstract-title">Abstract</h3>
    <p class="abstract-text">{file.abstract or 'No abstract available.'}</p>
  </div>"""

    # Add keywords if available
    if file.keywords:
        html_content += f"""
  <div class="keywords">
    <div class="keywords-title">Keywords:</div>
    <div class="keywords-list">{file.keywords}</div>
  </div>"""

    # Continue with the rest of the HTML
    html_content += f"""
  
  <div class="redirect-notice">
    <p>
      <strong>Note:</strong> You are being redirected to the interactive version of this preprint. 
      If the redirect doesn't work, <a href="{canonical_url}" class="redirect-link">click here</a>.
    </p>
  </div>
  
  <div class="citation-section">
    <h4 class="citation-title">How to Cite This Preprint</h4>
    <div class="citation-box">
      <strong>APA Format:</strong><br>
      {apa_citation}
    </div>
    
    <div class="citation-links">
      <a href="{canonical_url}/export/bibtex" class="citation-link">📁 Download BibTeX (.bib)</a>
      <a href="{canonical_url}" class="citation-link">🔗 View Interactive Version</a>
    </div>
  </div>
  
  <div class="footer">
    <p>This preprint is hosted on <a href="{base_url}" class="redirect-link">Aris</a>, a web-native scientific publishing platform.</p>
    <p>Static version for search engines • <a href="{canonical_url}" class="redirect-link">View interactive version</a></p>
  </div>
</body>
</html>"""

    return html_content


def detect_user_agent_type(user_agent: str) -> str:
    """Detect if user agent is a bot/crawler or human user.
    
    Parameters
    ----------
    user_agent : str
        The User-Agent header string.
        
    Returns
    -------
    str
        Either 'bot' or 'human' based on user agent analysis.
    """
    if not user_agent:
        return 'human'
    
    # Common bot/crawler patterns
    bot_patterns = [
        'bot', 'crawler', 'spider', 'indexer', 'googlebot', 'bingbot',
        'slurp', 'duckduckbot', 'facebookexternalhit', 'twitterbot',
        'linkedinbot', 'whatsapp', 'telegram', 'discordbot', 'slack',
        'archive.org', 'ia_archiver', 'wayback', 'google-structured-data',
        'schema.org', 'validators', 'lighthouse', 'pagespeed'
    ]
    
    user_agent_lower = user_agent.lower()
    
    for pattern in bot_patterns:
        if pattern in user_agent_lower:
            return 'bot'
    
    return 'human'