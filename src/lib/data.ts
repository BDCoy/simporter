import { supabase } from './supabase';

interface DataSource {
  type: 'product' | 'social' | 'review';
  content: string;
}

export async function gatherProprietaryData(query: string): Promise<DataSource[]> {
  const dataSources: DataSource[] = [];
  const searchTerms = query.toLowerCase().split(' ');

  try {
    // Query product data
    const { data: productData, error: productError } = await supabase
      .from('product_data')
      .select('*')
      .filter('category', 'ilike', `%${searchTerms[0]}%`)
      .or(`subcategory.ilike.%${searchTerms[0]}%,product.ilike.%${searchTerms[0]}%`);

    if (!productError && productData?.length > 0) {
      const content = formatProductData(productData);
      dataSources.push({
        type: 'product',
        content
      });
    }

    // Query social data
    const { data: socialData, error: socialError } = await supabase
      .from('social_data')
      .select('*')
      .filter('category', 'ilike', `%${searchTerms[0]}%`)
      .or(`subcategory.ilike.%${searchTerms[0]}%,attribute.ilike.%${searchTerms[0]}%`);

    if (!socialError && socialData?.length > 0) {
      const content = formatSocialData(socialData);
      dataSources.push({
        type: 'social',
        content
      });
    }

    // Query review data
    const { data: reviewData, error: reviewError } = await supabase
      .from('review_data')
      .select('*')
      .filter('category', 'ilike', `%${searchTerms[0]}%`)
      .or(`subcategory.ilike.%${searchTerms[0]}%,attribute.ilike.%${searchTerms[0]}%`);

    if (!reviewError && reviewData?.length > 0) {
      const content = formatReviewData(reviewData);
      dataSources.push({
        type: 'review',
        content
      });
    }

    return dataSources;
  } catch (error) {
    console.error('Error gathering proprietary data:', error);
    return [];
  }
}

function formatProductData(data: any[]): string {
  return data.map(item => `
Product: ${item.product}
Brand: ${item.brand || 'N/A'}
Category: ${item.category} > ${item.subcategory}
Source: ${item.source}
Reviews: ${item.review_mentions?.toLocaleString() || 0}
AI Score: ${item.ai_score || 'N/A'}
Share of Voice: ${item.share_of_voice || 'N/A'}
Consumer Passion: ${item.consumer_passion || 'N/A'}
${item.strengths?.length ? `Strengths: ${item.strengths.join(', ')}` : ''}
${item.weaknesses?.length ? `Weaknesses: ${item.weaknesses.join(', ')}` : ''}
  `).join('\n---\n');
}

function formatSocialData(data: any[]): string {
  return data.map(item => `
Platform: ${item.source}
Category: ${item.category} > ${item.subcategory}
Topic: ${item.attribute}
Posts/Videos: ${item.post_count?.toLocaleString() || 0}
Top 10 Likes: ${item.top_likes?.toLocaleString() || 0}
AI Score: ${item.ai_score || 'N/A'}
Share of Voice: ${item.share_of_voice || 'N/A'}
Consumer Passion: ${item.consumer_passion || 'N/A'}
  `).join('\n---\n');
}

function formatReviewData(data: any[]): string {
  return data.map(item => `
Source: ${item.source}
Category: ${item.category} > ${item.subcategory}
Topic: ${item.attribute}
Review Mentions: ${item.review_mentions?.toLocaleString() || 0}
AI Score: ${item.ai_score || 'N/A'}
Share of Voice: ${item.share_of_voice || 'N/A'}
Consumer Passion: ${item.consumer_passion || 'N/A'}
  `).join('\n---\n');
}