package com.examly.springapp.entity;

import java.util.Collection;

public interface UserDetails {

    Collection<? extends GrantedAuthority> getAuthorities();

    String getPassword();

    boolean isAccountNonExpired();

    boolean isAccountNonLocked();

    boolean isCredentialsNonExpired();

}
