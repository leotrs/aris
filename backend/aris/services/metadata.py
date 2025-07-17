"""Academic metadata generation service.

This module provides services for generating academic metadata standards
including Dublin Core, Schema.org, and academic citation meta tags.
"""

from datetime import datetime
from typing import Any, Dict, List

from ..models import File


class DublinCoreMetadata:
    """Dublin Core metadata generator for academic preprints."""
    
    def __init__(self, file: File):
        self.file = file
        self.base_url = "https://aris.com"  # TODO: Make configurable
    
    def generate_all_elements(self) -> Dict[str, str]:
        """Generate all 15 Dublin Core elements for a preprint.
        
        Returns
        -------
        Dict[str, str]
            Dictionary containing all Dublin Core elements.
        """
        return {
            "title": self._get_title(),
            "creator": self._get_creator(),
            "subject": self._get_subject(),
            "description": self._get_description(),
            "publisher": self._get_publisher(),
            "date": self._get_date(),
            "type": self._get_type(),
            "format": self._get_format(),
            "identifier": self._get_identifier(),
            "source": self._get_source(),
            "language": self._get_language(),
            "rights": self._get_rights(),
            "coverage": self._get_coverage(),
            "relation": self._get_relation(),
            "contributor": self._get_contributor(),
        }
    
    def _get_title(self) -> str:
        """Get Dublin Core title element."""
        return self.file.title or "Untitled"
    
    def _get_creator(self) -> str:
        """Get Dublin Core creator element (authors)."""
        # TODO: Extract from proper author fields when available
        return "Unknown Author"
    
    def _get_subject(self) -> str:
        """Get Dublin Core subject element (keywords)."""
        return self.file.keywords or ""
    
    def _get_description(self) -> str:
        """Get Dublin Core description element (abstract)."""
        return self.file.abstract or ""
    
    def _get_publisher(self) -> str:
        """Get Dublin Core publisher element."""
        return "Aris Preprint"
    
    def _get_date(self) -> str:
        """Get Dublin Core date element (publication date)."""
        if self.file.published_at:
            return self.file.published_at.strftime("%Y-%m-%d")
        return datetime.now().strftime("%Y-%m-%d")
    
    def _get_type(self) -> str:
        """Get Dublin Core type element."""
        return "Preprint"
    
    def _get_format(self) -> str:
        """Get Dublin Core format element."""
        return "text/html"
    
    def _get_identifier(self) -> str:
        """Get Dublin Core identifier element."""
        return self.file.public_uuid
    
    def _get_source(self) -> str:
        """Get Dublin Core source element."""
        return f"{self.base_url}/ication/{self.file.public_uuid}"
    
    def _get_language(self) -> str:
        """Get Dublin Core language element."""
        return "en"
    
    def _get_rights(self) -> str:
        """Get Dublin Core rights element."""
        return "All rights reserved"  # TODO: Make configurable
    
    def _get_coverage(self) -> str:
        """Get Dublin Core coverage element."""
        return ""  # Future implementation
    
    def _get_relation(self) -> str:
        """Get Dublin Core relation element."""
        return ""  # Future implementation
    
    def _get_contributor(self) -> str:
        """Get Dublin Core contributor element."""
        return ""  # Future implementation


class SchemaOrgMetadata:
    """Schema.org ScholarlyArticle metadata generator."""
    
    def __init__(self, file: File):
        self.file = file
        self.base_url = "https://aris.com"  # TODO: Make configurable
    
    def generate_json_ld(self) -> Dict[str, Any]:
        """Generate Schema.org JSON-LD structured data.
        
        Returns
        -------
        Dict[str, Any]
            Schema.org ScholarlyArticle JSON-LD structure.
        """
        canonical_url = f"{self.base_url}/ication/{self.file.public_uuid}"
        
        json_ld = {
            "@context": "https://schema.org",
            "@type": "ScholarlyArticle",
            "headline": self.file.title or "Untitled",
            "abstract": self.file.abstract or "",
            "author": self._get_authors(),
            "datePublished": self._get_publication_date(),
            "publisher": {
                "@type": "Organization",
                "name": "Aris Preprint"
            },
            "identifier": self.file.public_uuid,
            "url": canonical_url,
            "mainEntityOfPage": canonical_url,
            "genre": "preprint",
            "inLanguage": "en"
        }
        
        # Add keywords if available
        if self.file.keywords:
            json_ld["keywords"] = self.file.keywords
        
        # Add DOI if available (future implementation)
        # if self.file.doi:
        #     json_ld["sameAs"] = f"https://doi.org/{self.file.doi}"
        
        return json_ld
    
    def _get_authors(self) -> List[Dict[str, str]]:
        """Get Schema.org author objects.
        
        Returns
        -------
        List[Dict[str, str]]
            List of author objects with name and affiliation.
        """
        # TODO: Extract from proper author fields when available
        return [
            {
                "@type": "Person",
                "name": "Unknown Author"
            }
        ]
    
    def _get_publication_date(self) -> str:
        """Get ISO format publication date."""
        if self.file.published_at:
            return self.file.published_at.isoformat()
        return datetime.now().isoformat()


class AcademicMetaTags:
    """Academic citation meta tags generator (Highwire Press format)."""
    
    def __init__(self, file: File):
        self.file = file
        self.base_url = "https://aris.com"  # TODO: Make configurable
    
    def generate_meta_tags(self) -> Dict[str, str]:
        """Generate academic citation meta tags.
        
        Returns
        -------
        Dict[str, str]
            Dictionary of meta tag name/content pairs.
        """
        canonical_url = f"{self.base_url}/ication/{self.file.public_uuid}"
        
        meta_tags = {
            "citation_title": self.file.title or "Untitled",
            "citation_publication_date": self._get_publication_date(),
            "citation_journal_title": "Aris Preprint",
            "citation_abstract_html_url": canonical_url,
        }
        
        # Add authors (TODO: implement proper author extraction)
        # meta_tags["citation_author"] = "Unknown Author"
        
        # Add PDF URL if available
        # if self.file.pdf_url:
        #     meta_tags["citation_pdf_url"] = self.file.pdf_url
        
        # Add DOI if available
        # if self.file.doi:
        #     meta_tags["citation_doi"] = self.file.doi
        
        return meta_tags
    
    def _get_publication_date(self) -> str:
        """Get publication date in YYYY/MM/DD format."""
        if self.file.published_at:
            return self.file.published_at.strftime("%Y/%m/%d")
        return datetime.now().strftime("%Y/%m/%d")


class OpenGraphMetadata:
    """Open Graph metadata generator for social sharing."""
    
    def __init__(self, file: File):
        self.file = file
        self.base_url = "https://aris.com"  # TODO: Make configurable
    
    def generate_og_tags(self) -> Dict[str, str]:
        """Generate Open Graph meta tags.
        
        Returns
        -------
        Dict[str, str]
            Dictionary of Open Graph meta tag property/content pairs.
        """
        canonical_url = f"{self.base_url}/ication/{self.file.public_uuid}"
        
        og_tags = {
            "og:title": self.file.title or "Untitled",
            "og:type": "article",
            "og:url": canonical_url,
            "og:site_name": "Aris Preprint",
            "article:published_time": self._get_publication_date(),
        }
        
        # Add description (truncated abstract)
        if self.file.abstract:
            description = self.file.abstract[:160] + "..." if len(self.file.abstract) > 160 else self.file.abstract
            og_tags["og:description"] = description
        
        # Add authors (TODO: implement proper author extraction)
        # og_tags["article:author"] = "Unknown Author"
        
        return og_tags
    
    def _get_publication_date(self) -> str:
        """Get publication date in ISO format."""
        if self.file.published_at:
            return self.file.published_at.isoformat()
        return datetime.now().isoformat()


def generate_academic_metadata(file: File) -> Dict[str, Any]:
    """Generate comprehensive academic metadata for a preprint.
    
    Parameters
    ----------
    file : File
        The published preprint file.
        
    Returns
    -------
    Dict[str, Any]
        Complete academic metadata including all standards.
    """
    dublin_core = DublinCoreMetadata(file)
    schema_org = SchemaOrgMetadata(file)
    citation_meta = AcademicMetaTags(file)
    open_graph = OpenGraphMetadata(file)
    
    return {
        "dublin_core": dublin_core.generate_all_elements(),
        "schema_org": schema_org.generate_json_ld(),
        "citation_meta": citation_meta.generate_meta_tags(),
        "open_graph": open_graph.generate_og_tags(),
    }