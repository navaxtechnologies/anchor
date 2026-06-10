import { Linking, Platform } from 'react-native';
import type { Resource } from '@/types';

export function dial(phone: string) {
  const clean = phone.replace(/[^\d+]/g, '');
  void Linking.openURL(`tel:${clean}`);
}

export function sms(number: string, body?: string) {
  const clean = number.replace(/[^\d+]/g, '');
  const sep = Platform.OS === 'ios' ? '&' : '?';
  void Linking.openURL(`sms:${clean}${body ? `${sep}body=${encodeURIComponent(body)}` : ''}`);
}

export function openUrl(url: string) {
  const withScheme = /^https?:\/\//.test(url) ? url : `https://${url}`;
  void Linking.openURL(withScheme);
}

export function openDirections(resource: Pick<Resource, 'address' | 'lat' | 'lng' | 'name'>) {
  const query =
    resource.lat != null && resource.lng != null
      ? `${resource.lat},${resource.lng}`
      : encodeURIComponent(resource.address);
  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?q=${encodeURIComponent(resource.name)}&ll=${query}`
      : `https://www.google.com/maps/search/?api=1&query=${query}`;
  void Linking.openURL(url);
}
